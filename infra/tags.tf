module "tags" {
  source         = "git@github.com:starframe-systems/tf-stencils.git//tags?ref=v0.1.6"
  # inherited_tags = var.inherited_tags
  additional_tags = {
    "service.name"           = "lobbyart.org"
    "service.version"        = "0.1.0"
    "service.repository_url" = "https://github.com/brendanberg/lobbyart.org"
  }
}