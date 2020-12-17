FactoryBot.define do
  factory :like do
    association :user
    association :record
  end
end
