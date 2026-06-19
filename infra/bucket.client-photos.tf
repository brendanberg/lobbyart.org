
module "client_photos" {
  source = "git@github.com:starframe-systems/tf-stencils.git//s3_bucket?ref=v0.1.13"
  name   = "photos.${var.domain_name}"

  bucket_cors_configuration = [
    {
      allowed_headers = ["*"]
      allowed_methods = ["PUT", "POST"]
      allowed_origins = ["https://lobbyart.org", "http://localhost:3000"]
      expose_headers  = ["ETag"]
      max_age_seconds = 3000
    }
  ]

  inherited_tags = local.resource_tags
}
