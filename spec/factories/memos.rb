FactoryBot.define do
  factory :memo do
    appearance { 'memo' }
    breakfast { 'memo' }
    lunch { 'memo' }
    dinner { 'memo' }
    snack { 'memo' }
    association :record
  end
end
