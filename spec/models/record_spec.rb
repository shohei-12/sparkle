require 'rails_helper'

RSpec.describe Record, type: :model do
  let(:record1) { build(:record) }
  let(:record2) { create(:record) }
  let(:record3) { create(:record) }
  let(:user) { create(:user) }

  it 'return true' do
    expect(record1.valid?).to eq true
  end

  describe 'date' do
    context 'when empty' do
      before { record1.date = '' }

      it 'return false' do
        expect(record1.valid?).to eq false
      end
    end
  end

  describe 'user_id' do
    context 'when empty' do
      before { record1.user_id = '' }

      it 'return false' do
        expect(record1.valid?).to eq false
      end
    end

    context 'when user does not exist' do
      before { record1.user_id += 1 }

      it 'return false' do
        expect(record1.valid?).to eq false
      end
    end

    context 'when duplicate combination of user_id and date' do
      before do
        record1.user_id = record2.user_id
        record1.date = record2.date
      end

      it 'return false' do
        expect(record1.valid?).to eq false
      end
    end
  end

  describe '#liked_by?(current_user)' do
    context 'when liked' do
      before { user.like(record2) }

      it 'return true' do
        expect(record2.liked_by?(user)).to eq true
      end
    end

    context 'when not liked' do
      it 'return false' do
        expect(record2.liked_by?(user)).to eq false
      end
    end
  end

  describe '#self.get_record_infos(records, current_user)' do
    context 'when records exists' do
      it 'get record infos' do
        record_infos = described_class.get_record_infos([record2, record3], user)
        record2_info = { record: record2, index: 0 }
        record3_info = { record: record3, index: 1 }
        [record2_info, record3_info].each do |record_info|
          expect(record_infos[record_info[:index]][:record_id]).to eq record_info[:record].id
          expect(record_infos[record_info[:index]][:date]).to eq record_info[:record].date
          expect(record_infos[record_info[:index]][:appearance]).to eq record_info[:record].appearances.first
          expect(record_infos[record_info[:index]][:profile]).to eq record_info[:record].user.profile
          expect(record_infos[record_info[:index]][:author]).to eq record_info[:record].user.name
          expect(record_infos[record_info[:index]][:author_id]).to eq record_info[:record].user_id
          expect(record_infos[record_info[:index]][:likes]).to eq record_info[:record].likes.length
          expect(record_infos[record_info[:index]][:liking]).to eq record_info[:record].liked_by?(user)
        end
      end
    end

    context 'when records does not exist' do
      it 'not get record infos' do
        record_infos = described_class.get_record_infos([], user)
        expect(record_infos.length).to eq 0
      end
    end

    context 'when current user does not exist' do
      context 'when records exists' do
        it 'get record infos' do
          record_infos = described_class.get_record_infos([record2, record3], nil)
          expect(record_infos.length).to eq 2
        end
      end

      context 'when records does not exist' do
        it 'not get record infos' do
          record_infos = described_class.get_record_infos([], nil)
          expect(record_infos.length).to eq 0
        end
      end
    end
  end

  describe '#self.slice_images(images)' do
    context 'when images exists' do
      before { @appearances = create_list(:appearance, 2) }

      it 'slice images' do
        result = described_class.slice_images(@appearances)
        expect(result).to eq [
          [@appearances[0].id, @appearances[0].image.url],
          [@appearances[1].id, @appearances[1].image.url]
        ]
      end
    end

    context 'when images does not exist' do
      it 'raise NoMethodError' do
        expect { described_class.slice_images(nil) }.to raise_error(NoMethodError)
      end
    end
  end

  describe '#self.delete_images(appearances, meals, current_user_id)' do
    before do
      record = create(:record, user_id: user.id)
      @appearance1 = create(:appearance, record_id: record.id)
      @appearance2 = create(:appearance, record_id: record.id)
      @meal1 = create(:meal, record_id: record.id)
      @meal2 = create(:meal, record_id: record.id)
    end

    context 'when images belongs to me' do
      it 'delete images' do
        expect(Appearance.count).to eq 2
        expect(Meal.count).to eq 2
        described_class.delete_images(
          [@appearance1.id, @appearance2.id],
          [@meal1.id, @meal2.id],
          user.id
        )
        expect(Appearance.count).to eq 0
        expect(Meal.count).to eq 0
      end
    end

    context 'when images belongs to someone else' do
      it 'not delete images' do
        expect(Appearance.count).to eq 2
        expect(Meal.count).to eq 2
        described_class.delete_images(
          [@appearance1.id, @appearance2.id],
          [@meal1.id, @meal2.id],
          user.id + 1
        )
        expect(Appearance.count).to eq 2
        expect(Meal.count).to eq 2
      end
    end
  end
end
