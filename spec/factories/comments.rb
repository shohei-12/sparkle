FactoryBot.define do
  factory :comment do
    target { 'appearance' }
    content { 'comment' }
    reply_comment_id { nil }
    reply_user_id { nil }
    association :user
    association :record
  end
end
