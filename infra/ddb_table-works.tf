
module "ddb_table_works" {
  source = "git@github.com:starframe-systems/tf-stencils.git//dynamo_db?ref=v0.1.9"

  prefix     = replace(var.name, " ", "")
  table_name = "works"

  hash_key  = "id"
  range_key = "ver"

  attributes = [
    { name = "id", type = "S" },
    { name = "ver", type = "S" }
  ]
}
