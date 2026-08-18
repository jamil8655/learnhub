@echo off
title LearnHub Auto-Sync to GitHub
powershell.exe -ExecutionPolicy Bypass -File "%~dp0sync-to-github.ps1"
pause
