FactoryBot.define do
  factory :appearance do
    image { 'test.png' }
    association :record
  end
end
