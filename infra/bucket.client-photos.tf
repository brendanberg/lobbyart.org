
module "client_photos" {
    source = "git@github.com:starframe-systems/tf-stencils.git//s3_bucket?ref=v0.1.5"
    name = "photos.${var.domain_name}"
}
