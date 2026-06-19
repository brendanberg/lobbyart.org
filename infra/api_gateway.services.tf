
module "services_gateway" {
  source = "git@github.com:starframe-systems/tf-stencils.git//api_gateway_v1?ref=v0.1.13"

  authorized_handler_functions = [
    module.get-upload-url-handler.function_name,
    module.get-landmark-handler.function_name,
    module.patch-landmark-handler.function_name,
    module.post-landmark-handler.function_name
  ]

  name        = "CatalogService"
  prefix      = local.prefix
  description = "API Gateway for CatalogService"

  enable_custom_cname          = true
  enable_custom_cname_creation = true
  custom_cname_hostname        = "api"
  custom_cname_domain          = var.domain_name
  custom_cname_route53_zone_id = data.aws_route53_zone.default.id

  api_gateway_stage_name = "live"

  cors_configuration = {
    allow_origins = ["http://localhost:3000,https://lobbyart.org"]
    allow_methods = ["GET", "PATCH", "POST", "OPTIONS"]
    allow_headers = ["Accept", "Authorization", "Content-Type", "Origin", "x-amz-date", "x-apigateway-header", "x-terraform-config"]
  }

  openapi_specification = templatefile("../catalog/api.yaml", {
    get_upload_url_handler = module.get-upload-url-handler.function_invoke_arn
    post_work_handler      = module.post-landmark-handler.function_invoke_arn
    get_work_handler       = module.get-landmark-handler.function_invoke_arn
    patch_work_handler     = module.patch-landmark-handler.function_invoke_arn
  })

  inherited_tags = local.resource_tags
}
