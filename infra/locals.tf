locals {
    aws_account_id = data.aws_caller_identity.current.account_id
    aws_region     = data.aws_region.current.name
    resource_tags  = module.tags.combined_tags

    prefix = replace(var.name, " ", "")
}
