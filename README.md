# Onesandzeros Enterprise Solutions Website

Fortune-500 styled static website for enterprise technology advisory services.

## Deploy (single script)

Run the deployment script from an elevated PowerShell session on Windows with IIS installed:

```powershell
.\deploy.ps1
```

Optional parameters:

```powershell
.\deploy.ps1 -SiteName "OnesandzerosEnterprise" -AppPoolName "OnesandzerosEnterprisePool" -PhysicalPath "C:\inetpub\wwwroot\OnesandzerosEnterprise" -Port 8080
```

The script copies all required site files and configures IIS site + app pool end-to-end.
