@echo off

FOR /F "tokens=*" %%g IN ('flow scripts execute ./cadence/scripts/get_collection_length.cdc f8d6e0586b0a20c7 -o inline') do (SET VAR=%%g)
SET /A VAR_NUM=%VAR%

echo %VAR_NUM%

if %VAR_NUM% GTR 0 (
	echo "coincount is GREATER THAN 0"
	flow transactions send ./cadence/transactions/flip_coins.cdc
) else (
	echo "coincount is 0"
)