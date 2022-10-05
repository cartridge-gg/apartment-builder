resource "aws_dynamodb_table" "apartment" {
  name         = "${terraform.workspace}Apartment"
  hash_key     = "ApartmentID"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "ApartmentID"
    type = "S"
  }
}

data "aws_iam_policy_document" "apartmentbuilder" {
  policy_id = "${terraform.workspace}ApartmentBuilderPolicy"
  statement {
    sid    = "ApartmentBuilderTables"
    effect = "Allow"
    actions = [
      "dynamodb:PutItem",
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
    ]
    resources = [
      aws_dynamodb_table.apartment.arn,
    ]
  }
}

resource "aws_iam_policy" "dynamodb_policy" {
  name        = "${terraform.workspace}ApartmentBuilderPolicy"
  description = "The policy to access the starknet Apartment Builder"
  policy      = data.aws_iam_policy_document.apartmentbuilder.json
}

resource "aws_iam_role_policy_attachment" "dynamodb_for_lambda" {
  policy_arn = aws_iam_policy.dynamodb_policy.arn
  role       = aws_iam_role.iam_for_lambda.name
}
