# Migration Script for Portfolio Site

# 1. Fetch current remote state
Write-Host "Fetching remote state..."
git fetch origin

# 2. Create backup branch (if it doesn't exist locally)
Write-Host "Creating backup of old site..."
git branch old-site-backup origin/master 2>$null
git push origin old-site-backup

# 3. Add and Commit new files
Write-Host "Committing new site..."
git add .
git commit -m "Initialize portfolio site with Astro"

# 4. Force push to master (Replaces old site with new site)
Write-Host "Pushing new site to master..."
git push -u origin master --force

# 5. Deploy to GitHub Pages
Write-Host "Deploying to GitHub Pages..."
npm run deploy

Write-Host "Migration Complete! Check https://samaeen.github.io/shoummo/"
