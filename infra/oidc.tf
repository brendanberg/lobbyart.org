
module "oidc_github_deploy" {
  source = "git@github.com:starframe-systems/tf-stencils.git//github_oidc_policy?ref=v0.1.5"

  repository                  = var.github_repo_name
  openid_connect_provider_arn = "arn:aws:iam::${local.aws_account_id}:oidc-provider/token.actions.githubusercontent.com"
  policy_arns = [
    module.client_static_hosting.iam_policy_arn["ListGetPut"],
    module.frontend_distribution.iam_policy_arn["CreateInvalidation"],
    aws_iam_policy.ecr_mgmt.arn,
    aws_iam_policy.lambda_mgmt.arn,
    module.get-upload-url-handler.iam_policy_arn["UpdateFunctionCode"],
    module.get-landmark-handler.iam_policy_arn["UpdateFunctionCode"],
    module.patch-landmark-handler.iam_policy_arn["UpdateFunctionCode"],
    module.post-landmark-handler.iam_policy_arn["UpdateFunctionCode"],
  ]

  inherited_tags = local.resource_tags
}

resource "aws_iam_policy" "lambda_mgmt" {
  name   = "${replace(var.github_repo_name, "/", "-")}-LambdaManagement"
  policy = data.aws_iam_policy_document.lambda_mgmt.json
  tags   = local.resource_tags
}

data "aws_iam_policy_document" "lambda_mgmt" {
  statement {
    effect = "Allow"
    resources = [
      "*"
    ]
    actions = [
      "lambda:ListFunctions",
    ]
  }
}

resource "aws_iam_policy" "ecr_mgmt" {
  name   = "${replace(var.github_repo_name, "/", "-")}-EcrManagement"
  policy = data.aws_iam_policy_document.ecr_mgmt.json
  tags   = local.resource_tags
}

data "aws_iam_policy_document" "ecr_mgmt" {
  statement {
    effect = "Allow"
    ##  EXAMPLE ECR REPO ARN: arn:aws:ecr:${local.aws_region}:${local.aws_account_id}:repository/<github_repo_name>/<function_name>
    resources = [
      # for function in ["getUploadUrl"] :
      "arn:aws:ecr:${local.aws_region}:${local.aws_account_id}:repository/${var.github_repo_name}"
    ]
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:BatchImportUpstreamImage",
      "ecr:CompleteLayerUpload",
      "ecr:CreateRepository",
      "ecr:DescribeImages",
      "ecr:DescribeRepositories",
      "ecr:GetDownloadUrlForLayer",
      "ecr:GetRepositoryPolicy",
      "ecr:InitiateLayerUpload",
      "ecr:ListImages",
      "ecr:ListTagsForResource",
      "ecr:PutImage",
      "ecr:PutImageScanningConfiguration",
      "ecr:PutImageTagMutability",
      "ecr:PutLifecyclePolicy",
      "ecr:PutRegistryScanningConfiguration",
      "ecr:PutReplicationConfiguration",
      "ecr:ReplicateImage",
      "ecr:SetRepositoryPolicy",
      "ecr:StartImageScan",
      "ecr:StartLifecyclePolicyPreview",
      "ecr:TagResource",
      "ecr:UntagResource",
      "ecr:UploadLayerPart",
      ##  NOTE: THESE ARE DISABLED FOR SAFETY
      ##  THE IAM ROLE FOR GHA AUTOMATION FOR THIS REPO WON'T ALLOW ECR REPO DELETION, ANYWAY
      ##  UNDER SOME SITUATIONS, DEVOPS ENGINEERS MIGHT NEED TO RE-ENABLE THESE AND RUN TF MANUALLY
      ##  NON-DEVOPS ENGINEERS: PLEASE DO NOT RE-ENABLE THESE. IF YOU NEED TO DELETE AN ECR REPO
      ##  ASK DEVOPS TO DO IT FOR YOU
      #"ecr:DeleteLifecyclePolicy",
      #"ecr:DeleteRepository",
      #"ecr:DeleteRepositoryPolicy",
    ]
  }
  statement {
    effect    = "Allow"
    resources = ["*"]
    actions   = ["ecr:GetAuthorizationToken"]
  }
}
