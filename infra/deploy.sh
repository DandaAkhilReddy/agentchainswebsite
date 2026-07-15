#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# One-shot deploy: provision Azure infra, publish the Function App, and the
# dashboard. Requires: Azure CLI (az), Azure Functions Core Tools (func),
# and the SWA CLI (npm i -g @azure/static-web-apps-cli). Run: bash infra/deploy.sh
# ---------------------------------------------------------------------------
set -euo pipefail

RG="${RG:-rg-msjobs}"
LOCATION="${LOCATION:-eastus2}"
PREFIX="${PREFIX:-msjobs}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Ensuring resource group $RG ($LOCATION)"
az group create -n "$RG" -l "$LOCATION" -o none

echo "==> Deploying infrastructure (Bicep)"
OUTPUTS=$(az deployment group create \
  -g "$RG" -f "$ROOT/infra/main.bicep" \
  -p namePrefix="$PREFIX" swaLocation="$LOCATION" \
  --query properties.outputs -o json)

FUNC_APP=$(echo "$OUTPUTS" | python3 -c "import sys,json;print(json.load(sys.stdin)['functionAppName']['value'])")
API_BASE=$(echo "$OUTPUTS" | python3 -c "import sys,json;print(json.load(sys.stdin)['apiBase']['value'])")
SWA_NAME=$(echo "$OUTPUTS" | python3 -c "import sys,json;print(json.load(sys.stdin)['staticWebAppName']['value'])")
SWA_URL=$(echo "$OUTPUTS" | python3 -c "import sys,json;print(json.load(sys.stdin)['staticWebAppUrl']['value'])")

echo "==> Building + publishing Function App: $FUNC_APP"
( cd "$ROOT/api" && npm ci && npm run build && func azure functionapp publish "$FUNC_APP" --javascript )

echo "==> Wiring dashboard to API base: $API_BASE"
# Inject the API base into a copy of the dashboard so it works cross-origin.
TMP_WEB="$(mktemp -d)"
cp -r "$ROOT/web/." "$TMP_WEB/"
python3 - "$TMP_WEB/index.html" "$API_BASE" <<'PY'
import sys
path, api = sys.argv[1], sys.argv[2]
html = open(path, encoding="utf-8").read()
html = html.replace('window.API_BASE = window.API_BASE || "";',
                    f'window.API_BASE = "{api}";')
open(path, "w", encoding="utf-8").write(html)
PY

echo "==> Deploying dashboard to Static Web App: $SWA_NAME"
TOKEN=$(az staticwebapp secrets list -n "$SWA_NAME" -g "$RG" --query properties.apiKey -o tsv)
npx --yes @azure/static-web-apps-cli deploy "$TMP_WEB" --deployment-token "$TOKEN" --env production

echo ""
echo "============================================================"
echo " Deployed!"
echo "   Dashboard : $SWA_URL"
echo "   API base  : $API_BASE"
echo "   Function  : $FUNC_APP  (timer: daily)"
echo "============================================================"
echo "Trigger a first run now:"
echo "   curl -X POST \"$API_BASE/run\"   # (needs function key; see portal)"
