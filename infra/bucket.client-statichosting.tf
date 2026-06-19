
module "client_static_hosting" {
  source = "git@github.com:starframe-systems/tf-stencils.git//s3_bucket?ref=v0.1.7"
  name   = var.domain_name

  bucket_public_access = {
    block_public_policy     = false
    restrict_public_buckets = false
  }

  inherited_tags = local.resource_tags
}

module "client_static_website" {
  source         = "git@github.com:starframe-systems/tf-stencils.git//s3_bucket_website?ref=v0.1.7"
  bucket_name    = module.client_static_hosting.bucket_name
  inherited_tags = local.resource_tags
}
