FactoryBot.define do
  factory :comment do
    target { 'appearance' }
    reply_comment_id { nil }
    reply_user_id { nil }
    association :user
    association :record
  end
end
