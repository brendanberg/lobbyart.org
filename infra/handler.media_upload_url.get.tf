
module "get-upload-url-handler" {
  source = "git@github.com:starframe-systems/tf-stencils.git//lambda?ref=v0.1.11"

  name     = "getUploadUrl"
  prefix   = replace(var.name, " ", "")
  env_name = "production"

  environment_variables = {
    NODE_ENV                = "prod"
    S3_BUCKET_ASSET_UPLOADS = module.client_photos.bucket_name
  }

  image_repository_url = "${var.aws_ecr_registry_base_url}/${var.github_repo_name}"
  image_tag            = "base"

  image_config_overrides = {
    command = ["index.getUploadUrl"]
  }

  execution_role_policy_arns = [
    module.client_photos.iam_policy_arn["ListGetPut"]
  ]

  inherited_tags = local.resource_tags
}
