@echo off

:loop

set coinlog="C:/coinlogs/coinlog.txt"

set coinpath="C:/Code/Coinflip/coinflip"
CD %coinpath%

echo starting coinmonitor.bat at %date% %time% >> %coinlog%

FOR /F "tokens=*" %%g IN ('flow scripts execute ./cadence/scripts/get_collection_length.cdc 0x91b3acc974ec2f7d --network=testnet -o inline') do (SET VAR=%%g)
SET /A VAR_NUM=%VAR%

echo Number of coins is %VAR_NUM% >> %coinlog%

if %VAR_NUM% GTR 0 (
	echo coincount is GREATER THAN 0 >> %coinlog%
	flow transactions send ./cadence/transactions/flip_coins.cdc --network=testnet --signer=testnet-account
) else (
	echo coincount is 0 >> %coinlog%
)

timeout /t 30

goto loop