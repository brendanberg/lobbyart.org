
data "aws_route53_zone" "default" {
  name = var.domain_name
}

module "frontend_distribution" {
  source = "git@github.com:starframe-systems/tf-stencils.git//cloudfront_distribution?ref=v0.1.6"

  description              = "Cloudfront Distribution to serve frontend assets"
  origin_domain_name       = module.client_static_website.website_endpoint
  distribution_domain_name = module.client_static_hosting.bucket_name
  route53_zone_id          = data.aws_route53_zone.default.id
}

module "redirect_distribution" {
  source = "git@github.com:starframe-systems/tf-stencils.git//cloudfront_distribution?ref=v0.1.6"

  description              = "Cloudfront Distribution to redirect www traffic to root"
  origin_domain_name       = module.client_website_redirect.website_endpoint
  distribution_domain_name = module.client_static_redirect.bucket_name
  route53_zone_id          = data.aws_route53_zone.default.id
}
