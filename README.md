# BKK Follow-up Data
This repo produces json data files for https://github.com/electinth/bkk-followup

## Configuration & CSVs
A configuration file is required according to declaration on `config.ts`. The default can be found on `config.json`. 

### Summary Data Sheets
This sheet contains summary data for specific year.

#### Row Intention
1. The first row of the file is reserved for headers.
2. The second row is a Thai description which will be ignored.
3. The third row is for TOTAL district data.
4. The rest is described in one district per one row.


#### Columns
Note: `#N/A` can be used to identified as `Not Available` which the program may not use the data in benchmarking or ranking purposes.

|Column Header|Data Type|Example|Remark|
|-------|------|------|------|
|dist|string|คลองเตย|Name of the district which will be linked with district row|
|budget_total|string (number with seperators)|"316,050,200.00"||
|flood_bud|string (number with seperators)|"7,849,800.00"||
|flood_data1|number|9.00||
|waste_bud|string (number with seperators)|"134,585,400.00"||
|waste_data|number|2.925||
|green_bud|string (number with seperators)|"18,778,100.00"||
|green_data|number|5.06||
|water_bud|string (number with seperators)|"2,480,800.00"||
|water_data|number|36.12||
|air_bud|string (number with seperators)|"1,000,000.00"||
|air_data|number|1||
|flood_data2|number|33.8||

### District Data Sheet
This sheet contains information of every districts.

#### Row Intention
1. The first row of the file is reserved for headers.
2. The rest is described in one district per one row.

#### Columns
Note: empty string in this file means there is no data available.

|Column Header|Data Type|Example|Remark|
|-------|------|------|------|
|district|string|คลองเตย|This will be used as a key with other files|
|group|"พื้นที่อยู่อาศัย" \| "พื้นที่อยู่อาศัยชานเมือง" \| "พื้นที่อนุรักษ์ศิลปวัฒนธรรมและส่งเสริมการท่องเที่ยว" \| "พื้นที่ศูนย์กลางธุรกิจและพาณิชยกรรม"|"พื้นที่ศูนย์กลางธุรกิจและพาณิชยกรรม"|This will be used to group district|
|access_green|number|3.00||
|flood_spot|string (newlines allowed)|"- ถนนพระราม 3, บริเวณตลาดฮ่องกงปีนัง ถึงแยก ณ ระนอง<br />- ถนนพระราม 4, จากแยกสุขุมวิท ถึงแยกถนนเกษมราษฎร์<br />- ถนนสุนทรโกษา, จากแยกสุนทรโกษา ถึงหน้ากรมศุลกากร"|A newline is expected to form a readable text on the website|
|area|number|12.99||
|pop_density_min|string (number with seperators)|"7,792"||
|pop_density_max|string (number with seperators)|"8,389"||
|PM2.5 over|number|15||
|PM2.5 measurement|number|15||
## Output
This program will generate multiple json formated files. There are 3 types of files:

### District file (`districts.json`)
is a general information for all districts.

### Map files (`map_{air|flood|green|waste|water}.json`)
are values of specific topics by year and by district ID.

### Report files `report_{air|flood|green|waste|water}_{district*|all|residence|suburban|tourism-and-cultural|business}.json`
are data for each page rendering, for each specific type of districts or for each districts.

## How to Run
You machine must have [Deno](https://deno.land).
Run with the command:
```
deno run --allow-read --allow-write --allow-net app.ts
```
- `--allow-read` for configuration file reading
- `--allow-write` for writing output files in `./result`
- `--allow-net` for fetching csv files from the internet