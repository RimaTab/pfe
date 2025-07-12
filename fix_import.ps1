# Read the content of the file
$content = Get-Content -Path "c:\Users\FIDA\Desktop\frontend - Copie\pages\quiz.js" -Raw

# Replace the import statement
$newContent = $content -replace 'import \{ Check, X \} from ''lucide-react'';', 'import { Check, X, ChevronRight, ChevronLeft, ArrowRight, ArrowLeft } from ''lucide-react'';'

# Write the updated content back to the file
Set-Content -Path "c:\Users\FIDA\Desktop\frontend - Copie\pages\quiz.js" -Value $newContent -Force

Write-Host "File has been updated successfully!"
