// ---------------------------------------------------------------------------
// msjobs2linkedin — Azure infrastructure
//
// Provisions everything the pipeline needs, all on free / consumption tiers:
//   - Storage account          (digests + dedup state + Functions runtime store)
//   - Application Insights      (logs/metrics for the Function App)
//   - Consumption plan (Y1)     (serverless, pay-per-execution — free grant covers this)
//   - Linux Function App        (Node 20) hosting the timer + HTTP endpoints
//   - Static Web App (Free)     (hosts the copy-paste dashboard)
//
// Deploy:
//   az group create -n rg-msjobs -l eastus2
//   az deployment group create -g rg-msjobs -f infra/main.bicep -p namePrefix=msjobs
// ---------------------------------------------------------------------------

@description('Short prefix for resource names (lowercase letters/numbers).')
param namePrefix string = 'msjobs'

@description('Location for the Function App / storage.')
param location string = resourceGroup().location

@description('Location for the Static Web App (limited regions).')
@allowed(['eastus2', 'centralus', 'westus2', 'westeurope', 'eastasia'])
param swaLocation string = 'eastus2'

@description('Timer schedule (NCRONTAB). Default 07:30 daily.')
param schedule string = '0 30 7 * * *'

@description('Free-text job search query.')
param jobQuery string = 'Software Engineer'

@description('Comma-separated location filters.')
param jobLocations string = 'United States'

var suffix = uniqueString(resourceGroup().id)
var storageName = toLower('${namePrefix}${take(suffix, 8)}')
var funcAppName = '${namePrefix}-func-${take(suffix, 6)}'
var planName = '${namePrefix}-plan'
var aiName = '${namePrefix}-ai'
var swaName = '${namePrefix}-web-${take(suffix, 6)}'

resource storage 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: storageName
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
  properties: {
    minimumTlsVersion: 'TLS1_2'
    allowBlobPublicAccess: false
    supportsHttpsTrafficOnly: true
  }
}

resource ai 'Microsoft.Insights/components@2020-02-02' = {
  name: aiName
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
  }
}

resource plan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: planName
  location: location
  sku: { name: 'Y1', tier: 'Dynamic' }
  properties: { reserved: true } // Linux
}

var storageConn = 'DefaultEndpointsProtocol=https;AccountName=${storage.name};EndpointSuffix=${environment().suffixes.storage};AccountKey=${storage.listKeys().keys[0].value}'

resource funcApp 'Microsoft.Web/sites@2023-12-01' = {
  name: funcAppName
  location: location
  kind: 'functionapp,linux'
  identity: { type: 'SystemAssigned' }
  properties: {
    serverFarmId: plan.id
    reserved: true
    siteConfig: {
      linuxFxVersion: 'Node|20'
      cors: {
        allowedOrigins: ['*']
      }
      appSettings: [
        { name: 'AzureWebJobsStorage', value: storageConn }
        { name: 'WEBSITE_CONTENTAZUREFILECONNECTIONSTRING', value: storageConn }
        { name: 'WEBSITE_CONTENTSHARE', value: toLower(funcAppName) }
        { name: 'FUNCTIONS_EXTENSION_VERSION', value: '~4' }
        { name: 'FUNCTIONS_WORKER_RUNTIME', value: 'node' }
        { name: 'WEBSITE_NODE_DEFAULT_VERSION', value: '~20' }
        { name: 'AzureWebJobsFeatureFlags', value: 'EnableWorkerIndexing' }
        { name: 'APPLICATIONINSIGHTS_CONNECTION_STRING', value: ai.properties.ConnectionString }
        // --- pipeline config ---
        { name: 'AZURE_STORAGE_CONNECTION_STRING', value: storageConn }
        { name: 'MSJOBS_BLOB_CONTAINER', value: 'digests' }
        { name: 'MSJOBS_QUERY', value: jobQuery }
        { name: 'MSJOBS_LOCATIONS', value: jobLocations }
        { name: 'MSJOBS_TITLE_EXCLUDES', value: 'Intern,Internship' }
        { name: 'MSJOBS_MAX_AGE_HOURS', value: '24' }
        { name: 'MSJOBS_MAX_JOBS', value: '15' }
        { name: 'MSJOBS_MAX_PAGES', value: '4' }
        { name: 'MSJOBS_SCHEDULE', value: schedule }
      ]
    }
    httpsOnly: true
  }
}

resource swa 'Microsoft.Web/staticSites@2023-12-01' = {
  name: swaName
  location: swaLocation
  sku: { name: 'Free', tier: 'Free' }
  properties: {}
}

output functionAppName string = funcApp.name
output functionAppUrl string = 'https://${funcApp.properties.defaultHostName}'
output apiBase string = 'https://${funcApp.properties.defaultHostName}/api'
output staticWebAppName string = swa.name
output staticWebAppUrl string = 'https://${swa.properties.defaultHostname}'
output storageAccount string = storage.name
