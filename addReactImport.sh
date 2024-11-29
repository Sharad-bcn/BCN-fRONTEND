#!/bin/bash

# Loop through all .jsx files in the current directory and subdirectories
find . -type f -name "*.jsx" | while read -r file; do
  # Check if 'import React' already exists in the file
  if ! grep -q "import React from 'react';" "$file"; then
    # If 'import React' is not found, add it at the top of the file
    sed -i '' '1s/^/import React from '\''react'\'';\n/' "$file"
    echo "Added 'import React' to $file"
  else
    echo "'import React' already exists in $file"
  fi
done

