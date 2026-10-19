const fs = require('fs');
const path = require('path');

// We can read transcript or save the raw data.
// Let's create an importer and SQL generator that will take this backup and generate:
// 1. Storage bucket creation SQL
// 2. Table creation / data insertion SQL
// 3. RLS policy creation SQL
