# Define the resource types in the correct order
$orderedKinds = @(
    "Namespace",
    "Secret",
    "ConfigMap",
    "PersistentVolume",
    "PersistentVolumeClaim",
    "Service",
    "Deployment",
    "Ingress"
)

# Collect all YAML files in subdirectories
$yamlFiles = Get-ChildItem -Path . -Recurse -Include *.yaml, *.yml

# Group files by resource kind (parsed from `kind:` inside the YAML)
$resourcesByKind = @{}

foreach ($file in $yamlFiles) {
    $lines = Get-Content $file.FullName
    foreach ($line in $lines) {
        if ($line -match '^\s*kind:\s*(\w+)\s*$') {
            $kind = $Matches[1]
            if (-not $resourcesByKind.ContainsKey($kind)) {
                $resourcesByKind[$kind] = @()
            }
            $resourcesByKind[$kind] += $file.FullName
            break
        }
    }
}

# Apply resources in the defined order
foreach ($kind in $orderedKinds) {
    if ($resourcesByKind.ContainsKey($kind)) {
        foreach ($file in $resourcesByKind[$kind]) {
            Write-Host "Applying $kind from $file"
            kubectl apply -f $file
        }
    }
}

# Apply any remaining resources not listed in orderedKinds
$remainingKinds = $resourcesByKind.Keys | Where-Object { $orderedKinds -notcontains $_ }
foreach ($kind in $remainingKinds) {
    foreach ($file in $resourcesByKind[$kind]) {
        Write-Host "Applying $kind from $file (unsorted)"
        kubectl apply -f $file
    }
}

# ./deply-k8s.ps1 powershell in kubernetes directory