# Define as variáveis que o cliente deve preencher
$AWS_ACCESS_KEY_ID = "AKIA2S2Y36QFEEUPKO6F"
$AWS_SECRET_ACCESS_KEY = "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"
$AWS_REGION = "us-east-1"  
$PROJECT_DIR = $PSScriptRoot # Caminho da aplicação Serverless

$URL_API_DICIONARIO = "https://aywcbxk6ql.execute-api.us-east-1.amazonaws.com/dev/"
$NOME_CSA = "CSA SCRIPT"
$NOME_RESPONSAVEL = "Murilo SCRIPT"
$EMAIL_CSA = "EMAIL@email.com"

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


