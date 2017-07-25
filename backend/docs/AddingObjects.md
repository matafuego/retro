# Generating models

$ sequelize model:create --name Example1 --attributes title:string

$ sequelize model:create --name Example2 --attributes content:string,complete:boolean

# Generating migrations

$ sequelize migration:create

## Running migrations

$ sequelize db:migrate