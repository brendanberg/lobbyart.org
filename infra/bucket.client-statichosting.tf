
module "client_static_hosting" {
  source = "git@github.com:starframe-systems/tf-stencils.git//s3_bucket?ref=v0.1.5"
  name = "${var.domain_name}"

  bucket_public_access = {
    block_public_acls = true
    ignore_public_acls = true
    block_public_policy = false
    restrict_public_buckets = false
  }
}

module "client_static_website" {
  source = "git@github.com:starframe-systems/tf-stencils.git//s3_bucket_website?ref=v0.1.6"

  bucket_name = module.client_static_hosting.bucket_name
}
