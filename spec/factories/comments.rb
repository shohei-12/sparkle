FactoryBot.define do
  factory :comment do
    user { nil }
    record { nil }
    target { 'MyString' }
    reply { '' }
    reply_user_id { 'MyString' }
    number { 'MyString' }
  end
end
