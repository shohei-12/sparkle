# guest user
User.create!(
  profile: open("#{Rails.root}/db/fixtures/user/guest.jpg"),
  name: 'ゲスト',
  email: 'guest@example.com',
  password: 'password',
  password_confirmation: 'password',
  theme: 'light'
  self_introduction: 'ゲストユーザーです。'
)

# sub user
4.times do |n|
  User.create!(
    profile: open("#{Rails.root}/db/fixtures/user/sub#{n + 1}.jpg"),
    name: Faker::Name.unique.first_name,
    email: "sub#{n + 1}@example.com",
    password: 'password',
    password_confirmation: 'password',
    theme: 'light'
    self_introduction: "ユーザー#{n + 1}です。"
  )
end

# relationships
5.times do |n|
  5.times do |i|
    next unless (n + 1) != (i + 1)

    Relationship.create!(
      user_id: n + 1,
      follow_id: i + 1
    )
  end
end

# records
head = Date.new(2021, 2, 1)
tail = Date.new(2021, 2, 28)
(head..tail).each do |d|
  5.times do |n|
    Record.create!(
      date: d,
      user_id: n + 1
    )
  end
end

# likes
5.times do |n|
  50.times do |i|
    Like.create!(
      user_id: n + 1,
      record_id: i + 1
    )
  end
end

# memos
140.times do |n|
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
140.times do |n|
  rand(0..5).times do
    Appearance.create!(
      image: open("#{Rails.root}/db/fixtures/appearances/appearance#{rand(1..2)}.jpg"),
      record_id: n + 1
    )
  end
end

# meals
140.times do |i|
  rand(0..3).times do |n|
    Meal.create!(
      image: open("#{Rails.root}/db/fixtures/meal/meal.jpg"),
      meal_type: 'breakfast',
      record_id: i + 1
    )
  end

  rand(0..3).times do |n|
    Meal.create!(
      image: open("#{Rails.root}/db/fixtures/meal/meal.jpg"),
      meal_type: 'lunch',
      record_id: i + 1
    )
  end

  rand(0..3).times do |n|
    Meal.create!(
      image: open("#{Rails.root}/db/fixtures/meal/meal.jpg"),
      meal_type: 'dinner',
      record_id: i + 1
    )
  end

  rand(0..3).times do |n|
    Meal.create!(
      image: open("#{Rails.root}/db/fixtures/meal/meal.jpg"),
      meal_type: 'snack',
      record_id: i + 1
    )
  end
end
