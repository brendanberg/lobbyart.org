
module "patch-landmark-handler" {
  source = "git@github.com:starframe-systems/tf-stencils.git//lambda?ref=v0.1.11"

  name     = "patchLandmark"
  prefix   = replace(var.name, " ", "")
  env_name = "production"

  timeout = 15

  environment_variables = {
    NODE_ENV        = "prod"
    DDB_TABLE_WORKS = module.ddb_table_works.table.name
  }

  image_repository_url = "${var.aws_ecr_registry_base_url}/${var.github_repo_name}"
  image_tag            = "base"

  image_config_overrides = {
    command = ["index.patchLandmark"]
  }

  execution_role_policy_arns = [
    module.ddb_table_works.iam_policy_arn["Query"],
    module.ddb_table_works.iam_policy_arn["Put"]
  ]

  inherited_tags = local.resource_tags
}
