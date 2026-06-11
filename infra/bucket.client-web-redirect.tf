
module "client_static_redirect" {
  source = "git@github.com:starframe-systems/tf-stencils.git//s3_bucket?ref=v0.1.5"
  name = "www.${var.domain_name}"
  
  bucket_public_access = {
    block_public_acls = true
    ignore_public_acls = true
    block_public_policy = false
    restrict_public_buckets = false
  }
}

module "client_website_redirect" {
  source = "git@github.com:starframe-systems/tf-stencils.git//s3_bucket_website?ref=v0.1.6"

  bucket_name = module.client_static_redirect.bucket_name
  redirect_all_requests_to = {
    protocol  = "https"
    host_name = var.domain_name
  }
}
