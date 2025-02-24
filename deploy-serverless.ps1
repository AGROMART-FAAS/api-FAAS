# Caminho do arquivo .env (assume que está no mesmo diretório do script)
$envFilePath = Join-Path $PSScriptRoot ".env"

# Verifica se o arquivo existe
if (Test-Path $envFilePath) {
    Get-Content $envFilePath | ForEach-Object {
        if ($_ -match "^(.*?)=(.*)$") {
            Set-Variable -Name $matches[1] -Value $matches[2]
        }
    }
} else {
    Write-Host "Arquivo .env não encontrado!"
    exit
}

$PROJECT_DIR = $PSScriptRoot # Caminho da aplicação Serverless

# Função para verificar se um comando existe
function CommandExists {
    param (
        [string]$command
    )
    $exists = $false
    try {
        if (Get-Command $command -ErrorAction Stop) {
            $exists = $true
        }
    } catch {}
    return $exists
}

# Instalar Node.js, se necessário
if (-not (CommandExists "node")) {
    Write-Output "Instalando Node.js..."
    Invoke-WebRequest -Uri "https://nodejs.org/dist/v18.17.1/node-v18.17.1-x64.msi" -OutFile "nodejs.msi"
    Start-Process -FilePath "nodejs.msi" -Wait -ArgumentList "/quiet"
    Remove-Item "nodejs.msi"
}

# Instalar Serverless Framework, se necessário
if (-not (CommandExists "serverless")) {
    Write-Output "Instalando Serverless Framework..."
    npm install -g serverless
}

# Instalar AWS CLI, se necessário
if (-not (CommandExists "aws")) {
    Write-Output "Instalando AWS CLI..."
    Invoke-WebRequest -Uri "https://awscli.amazonaws.com/AWSCLIV2.msi" -OutFile "AWSCLIV2.msi"
    Start-Process -FilePath "AWSCLIV2.msi" -Wait -ArgumentList "/quiet"
    Remove-Item "AWSCLIV2.msi"
}

# Configurar credenciais da AWS
aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set region $AWS_REGION

# Navegar até o diretório do projeto
Set-Location $PROJECT_DIR

# Instalar dependências do projeto
npm install

# Fazer deploy
serverless deploy 2>&1 | Tee-Object -Variable deployOutput

# Capturar URL Base da API
$apiUrls = $deployOutput | Select-String -Pattern "(https://[a-zA-Z0-9.-]+\.amazonaws\.com/[a-zA-Z0-9/-]+)" -AllMatches | ForEach-Object { $_.Matches.Value }
$baseApiUrl = $apiUrls | Select-String -Pattern "^https:\/\/[^\/]+\/dev" -AllMatches | Select-Object -First 1 | ForEach-Object { $_.Matches.Value } 

# Requisicao POST para a api dicionario, salvando nela a URL da csa criada
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    nomeCSA       = "$NOME_CSA"
    responsavelCSA = "$NOME_RESPONSAVEL"
    emailCSA      = "$EMAIL_CSA"
    urlBase       = "$baseApiUrl"
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri "$URL_API_DICIONARIO" `
    -Method Post `
    -Headers $headers `
    -Body $body `
    -UseBasicParsing | Out-Null


