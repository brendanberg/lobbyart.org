
module "oidc_github_deploy" {
    source = "git@github.com:starframe-systems/tf-stencils.git//github_oidc_policy?ref=v0.1.5"

    repository = var.repository
    openid_connect_provider_arn = "arn:aws:iam::${local.account_id}:oidc-provider/token.actions.githubusercontent.com"
    policy_arns = [
        # module.client_photos.iam_policy_arn["ListGetPut"],
        # module.client_static_hosting.iam_policy_arn["ListGetPut"]
    ]
    # inherited_tags = local.combined_tags
}
