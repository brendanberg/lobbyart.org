
module "get-landmark-handler" {
  source = "git@github.com:starframe-systems/tf-stencils.git//lambda?ref=v0.1.11"

  name     = "getLandmark"
  prefix   = replace(var.name, " ", "")
  env_name = "production"

  environment_variables = {
    NODE_ENV        = "prod"
    NODE_OPTIONS    = "--enable-source-maps"
    DDB_TABLE_WORKS = module.ddb_table_works.table.name
  }

  image_repository_url = "${var.aws_ecr_registry_base_url}/${var.github_repo_name}"
  image_tag            = "base"

  image_config_overrides = {
    command = ["index.getLandmark"]
  }

  execution_role_policy_arns = [
    module.ddb_table_works.iam_policy_arn["Get"],
  ]

  inherited_tags = local.resource_tags
}
