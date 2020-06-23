[![npm version](https://badge.fury.io/js/druid-query-toolkit.svg)](//npmjs.com/package/druid-query-toolkit)

# Druid Query Toolkit

A number of tools to make working with Druid queries a treat.

## Set up 

Install druid-query-toolkit

`npm i druid-query-toolkit`

## SQL to AST 

Converts an SQL string to a SqlQuery object.  

```
import { parseSql, parseSqlQuery } from './parser/druidsql';

ast = parseSqlQuery(`SELECT "segment_id", "datasource", "start", "end", "size", "version", "partition_num", "num_replicas", "num_rows", "is_published", "is_available", "is_realtime", "is_overshadowed", "payload"
FROM sys.segments
ORDER BY "start" DESC
LIMIT 25`);
```      

## toString 

Returns the SQL query represented by the SqlQuery object as a string.

```
const sqlString = ast.toString();
console.log(sqlString);
```

logs: 

```
SELECT "segment_id", "datasource", "start", "end", "size", "version", "partition_num", "num_replicas", "num_rows", "is_published", "is_available", "is_realtime", "is_overshadowed", "payload"
FROM sys.segments
ORDER BY "start" DESC
LIMIT 25
```

## orderBy

Returns an SqlQuery object with a new ORDER BY clause. 

Takes arguments:

- `column:string`
- `direction: 'ASC' | 'DESC'`

```
const orderedAst = ast.toString('end', 'ASC');
console.log(orderedAst.toString());
```

logs: 

```
SELECT "segment_id", "datasource", "start", "end", "size", "version", "partition_num", "num_replicas", "num_rows", "is_published", "is_available", "is_realtime", "is_overshadowed", "payload"
FROM sys.segments
ORDER BY "end" ASC
LIMIT 25
```

## excludeColumn

Returns an SqlQuery object with with the specified column removed from the SELECT, ORDER BY and GROUP BY clauses.

Takes arguments:

- `column:string`

```
const excludeColumnAst = ast.excludeColumn('start');
console.log(excludeColumnAst.toString());
```

logs: 

```
SELECT "segment_id", "datasource", "end", "size", "version", "partition_num", "num_replicas", "num_rows", "is_published", "is_available", "is_realtime", "is_overshadowed", "payload"
FROM sys.segments
LIMIT 25
```

## getSorted

Returns an array of objects of type `{desc: string, id:string}` representing the direction of each column in the ORDER BY clause.

```
const getSortedArray = ast.getSorted();
console.log(getSortedArray);
```
  
## getSchema

Returns the schema of the table in the FROM clause as a string.

```
const schema = ast.getSchema();
console.log(schema);
```

logs:                 

```
sys
```

## getTableName

Returns the name of the table in the FROM clause as a string.

```
const table = ast.getTableName();
console.log(table);
```
     
logs:                 

```
segments
```

## getAggregateColumns

Returns an array of strings containing the names of the aggregate columns.

```
const aggregateColumns = ast.getAggregateColumns();
console.log(aggregateColumns);
```
     
logs:                 

```
Array [
  "segment_id",
  "datasource",
  "start",
  "end",
  "size",
  "version",
  "partition_num",
  "num_replicas",
  "num_rows",
  "is_published",
  "is_available",
  "is_realtime",
  "is_overshadowed",
  "payload",
]
```

## addToGroupBy

Adds a column with no alias to the group by clause and the select clause

Takes argument:

- `column: SqlBase`
    
```
let query = parseSqlQuery(`select Count(*) from table`);
query = query.addToGroupBy(SqlRef.factoryWithQuotes('column');
console.log(query.toString());
```

logs:                 

```
select "column", Count(*) from table 
    GROUP BY 1
```

## addAggregateColumn

Adds an aggregate column to the select

Takes arguments:

- `columns: SqlBase[]`
- `functionName: string`
- `alias: string`
- `filter?: SqlBase`
- `decorator?: string`
    
```
let query = parseSqlQuery(`select column1 from table`);
query = query.addAggregateColumn([SqlRef.factory('column2')], 'min', 'alias');
console.log(query.toString());
```

logs:                 

```
select column1, min(column2) AS "alias" from table
```

## getColumns

Returns an array of the string names of all columns in the select clause.

```
let query = parseSqlQuery(`SELECT column, column1, column2
                      FROM sys."github"`);
query = query.getColumns();
console.log(query.toString());
```

logs:                 

```
["column", "column1", "column2"]
```

## HasGroupByColumn

Checks to see if a column is in the group by clause either by name or index

Takes argument:

- `column: string`

```
let query = parseSqlQuery(`SELECT column, column1, column2
                      FROM sys."github"
                      Group By column, 3`);
query = query.hasGroupByColumn("column2");
console.log(query.toString());
```

logs:                 

```
true
```

## ReplaceFrom

Replaces the `From` value of an SqlQuery Object, allowing you to which the the table in the select clause.  

Takes argument:

- `table: string`

```
let query = parseSqlQuery(`SELECT countryName from wikipedia`);
query = query.replaceFrom("anotherTable");
console.log(query.toString());
```

logs:                 

```
"SELECT countryName from anotherTable"
```

## addJoin

Adds either an "INNER" or "LEFT" Join to an existing SqlQuery object. 

Takes arguments:
- `type: 'LEFT' | 'INNER'`
- `joinTable: SqlRef`
- `onExpression: SqlMulti`

```
let query = parseSqlQuery(`SELECT countryName from wikipedia`)
query = query.addJoin(
  'LEFT',
  SqlRef.factory('country', 'lookup'),
  SqlMulti.sqlMultiFactory('=', [
    SqlRef.factory('v', 'country', 'lookup'),
    SqlRef.factory('countryName', 'wikipedia'),
  ]),
);

console.log(query.toString());
```
     
logs:                 

```
"SELECT countryName from wikipedia 
LEFT JOIN lookup.country ON lookup.country.v = wikipedia.countryName"
```

## RemoveJoin

Removes the Join clause from an SqlQuery object. 

```
let query = parseSqlQuery(`SELECT countryName from wikipedia
      LEFT JOIN lookup.country ON lookup.country.v = wikipedia.countryName`);
query = query.removeJoin();
console.log(query.toSting());
```
     
logs:                 

```
SELECT countryName from wikipedia
```

## ToDo

- Add support for `/* inline comments */`
- Clean up APIs
- `(a, b) IN (subquery)`
- Fancy group by definitions e.g. `GROUPING SETS`, `CUBE`

## License 

[Apache 2.0](LICENSE)
