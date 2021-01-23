# guest user
User.create!(
  profile: open("#{Rails.root}/db/fixtures/guest-profile.jpg"),
  name: 'ゲスト',
  email: 'guest@example.com',
  password: 'password',
  password_confirmation: 'password',
  theme: 'light'
)

# sub user
50.times do |n|
  User.create!(
    name: Faker::Name.unique.first_name,
    email: "sub#{n + 1}@example.com",
    password: 'password',
    password_confirmation: 'password',
    theme: 'light'
  )
end

# relationships
51.times do |n|
  51.times do |i|
    next unless (n + 1) != (i + 1)

    Relationship.create!(
      user_id: n + 1,
      follow_id: i + 1
    )
  end
end

# records
head = Date.new(2021, 1, 1)
tail = Date.new(2021, 2, 28)
(head..tail).each do |d|
  51.times do |n|
    Record.create!(
      date: d,
      user_id: n + 1
    )
  end
end

# likes
51.times do |n|
  50.times do |i|
    Like.create!(
      user_id: n + 1,
      record_id: i + 1
    )
  end
end

# memos
3009.times do |n|
  Memo.create!(
    appearance: '見た目についてメモを残せます。',
    breakfast: '朝食についてメモを残せます。',
    lunch: '昼食についてメモを残せます。',
    dinner: '夕食についてメモを残せます。',
    snack: '間食についてメモを残せます。',
    record_id: n + 1
  )
end

# appearances
3009.times do |n|
  rand(0..5).times do
    Appearance.create!(
      image: open("#{Rails.root}/db/fixtures/appearances/appearance#{rand(1..5)}.jpg"),
      record_id: n + 1
    )
  end
end

# meals
3009.times do |i|
  rand(0..3).times do |n|
    Meal.create!(
      image: open("#{Rails.root}/db/fixtures/breakfasts/meal#{n + 1}.jpg"),
      meal_type: 'breakfast',
      record_id: i + 1
    )
  end

  rand(0..3).times do |n|
    Meal.create!(
      image: open("#{Rails.root}/db/fixtures/lunchs/meal#{n + 1}.jpg"),
      meal_type: 'lunch',
      record_id: i + 1
    )
  end

  rand(0..3).times do |n|
    Meal.create!(
      image: open("#{Rails.root}/db/fixtures/dinners/meal#{n + 1}.jpg"),
      meal_type: 'dinner',
      record_id: i + 1
    )
  end

  rand(0..3).times do |n|
    Meal.create!(
      image: open("#{Rails.root}/db/fixtures/snacks/meal#{n + 1}.jpg"),
      meal_type: 'snack',
      record_id: i + 1
    )
  end
end
