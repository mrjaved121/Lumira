# PowerShell script to test Login API
# Run this script: .\test-login.ps1

$baseUrl = "http://localhost:3000/api"

Write-Host "`n=== Testing Lumira Authentication APIs ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Register a test user
Write-Host "Step 1: Registering a test user..." -ForegroundColor Yellow
$registerBody = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
    role = "customer"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method POST -Body $registerBody -ContentType "application/json" -UseBasicParsing
    $registerData = $registerResponse.Content | ConvertFrom-Json
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "User ID: $($registerData.data.user._id)" -ForegroundColor Gray
    Write-Host "Email: $($registerData.data.user.email)" -ForegroundColor Gray
    Write-Host ""
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        $errorContent = $_.ErrorDetails.Message | ConvertFrom-Json
        if ($errorContent.error -like "*already exists*") {
            Write-Host "ℹ️  User already exists, continuing with login test..." -ForegroundColor Yellow
        } else {
            Write-Host "❌ Registration failed: $($errorContent.error)" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Step 2: Test Login with Valid Credentials
Write-Host "Step 2: Testing login with valid credentials..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -UseBasicParsing
    $loginData = $loginResponse.Content | ConvertFrom-Json
    
    if ($loginData.success) {
        Write-Host "✅ Login successful!" -ForegroundColor Green
        Write-Host "User: $($loginData.data.user.name)" -ForegroundColor Gray
        Write-Host "Email: $($loginData.data.user.email)" -ForegroundColor Gray
        Write-Host "Role: $($loginData.data.user.role)" -ForegroundColor Gray
        Write-Host "Token received: $($loginData.data.token.Substring(0, 20))..." -ForegroundColor Gray
        Write-Host ""
        
        # Save token for next test
        $global:authToken = $loginData.data.token
        
        # Step 3: Test /me endpoint with token
        Write-Host "Step 3: Testing GET /api/auth/me with token..." -ForegroundColor Yellow
        try {
            $headers = @{
                "Authorization" = "Bearer $($global:authToken)"
            }
            $meResponse = Invoke-WebRequest -Uri "$baseUrl/auth/me" -Method GET -Headers $headers -UseBasicParsing
            $meData = $meResponse.Content | ConvertFrom-Json
            
            if ($meData.success) {
                Write-Host "✅ /me endpoint works!" -ForegroundColor Green
                Write-Host "Retrieved user: $($meData.data.user.name)" -ForegroundColor Gray
            }
        } catch {
            Write-Host "❌ /me endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} catch {
    $errorContent = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "❌ Login failed: $($errorContent.error)" -ForegroundColor Red
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Step 4: Test Login with Invalid Password
Write-Host "`nStep 4: Testing login with invalid password..." -ForegroundColor Yellow
$invalidLoginBody = @{
    email = "test@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $invalidResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $invalidLoginBody -ContentType "application/json" -UseBasicParsing
    Write-Host "❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    $errorContent = $_.ErrorDetails.Message | ConvertFrom-Json
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Correctly rejected invalid password!" -ForegroundColor Green
        Write-Host "Error message: $($errorContent.error)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Unexpected error: $($errorContent.error)" -ForegroundColor Red
    }
}

# Step 5: Test Login with Invalid Email
Write-Host "`nStep 5: Testing login with invalid email..." -ForegroundColor Yellow
$invalidEmailBody = @{
    email = "nonexistent@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $invalidEmailResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $invalidEmailBody -ContentType "application/json" -UseBasicParsing
    Write-Host "❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    $errorContent = $_.ErrorDetails.Message | ConvertFrom-Json
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Correctly rejected invalid email!" -ForegroundColor Green
        Write-Host "Error message: $($errorContent.error)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Unexpected error: $($errorContent.error)" -ForegroundColor Red
    }
}

# Step 6: Test Login with Invalid Data Format
Write-Host "`nStep 6: Testing login with invalid data format..." -ForegroundColor Yellow
$invalidFormatBody = @{
    email = "not-an-email"
    password = "123"
} | ConvertTo-Json

try {
    $invalidFormatResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Body $invalidFormatBody -ContentType "application/json" -UseBasicParsing
    Write-Host "❌ Should have failed validation but didn't!" -ForegroundColor Red
} catch {
    $errorContent = $_.ErrorDetails.Message | ConvertFrom-Json
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✅ Correctly rejected invalid format!" -ForegroundColor Green
        Write-Host "Validation errors:" -ForegroundColor Gray
        $errorContent.details | ForEach-Object {
            Write-Host "  - $($_.field): $($_.message)" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ Unexpected error: $($errorContent.error)" -ForegroundColor Red
    }
}

Write-Host "`n=== Testing Complete ===" -ForegroundColor Cyan
Write-Host ""



