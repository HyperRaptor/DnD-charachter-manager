# Install Npgsql if not already installed
if (-not (Get-Module -ListAvailable -Name Npgsql)) {
    Write-Host "Installing Npgsql module..."
    Install-Package Npgsql -Force
}

# Load the Npgsql assembly
Add-Type -Path (Get-Package Npgsql).Source

# Connection string
$connString = "Host=localhost;Port=5434;Database=notesdb;Username=postgres;Password=postgres"

try {
    # Create connection
    $conn = New-Object Npgsql.NpgsqlConnection($connString)
    $conn.Open()

    # SQL commands to reset the database
    $sql = @"
    DROP TABLE IF EXISTS species_traits CASCADE;
    DROP TABLE IF EXISTS trait CASCADE;
    DROP TABLE IF EXISTS character CASCADE;
    DROP TABLE IF EXISTS species CASCADE;
"@

    # Create command and execute
    $cmd = New-Object Npgsql.NpgsqlCommand($sql, $conn)
    $cmd.ExecuteNonQuery()

    # Clean up
    $cmd.Dispose()
    $conn.Close()
    $conn.Dispose()

    Write-Host "Database reset complete. Please restart your application."
} catch {
    Write-Host "Error resetting database: $_"
    exit 1
} 