#!/bin/bash
echo "🔍 Testando detecção automática de oportunidades..."
curl -X POST "https://twglceexfetejawoumsr.supabase.co/functions/v1/opportunity-detector" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Z2xjZWV4ZmV0ZWphd291bXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MjExOTAsImV4cCI6MjA3NDQ5NzE5MH0.kVKkE-dbIDi2-31-pCKBVzjjk5Hu-SV7SgmKzQVkaeY" \
  -H "Content-Type: application/json" \
  -d '{"categories":["health-supplements"],"auto_analyze":true}'
