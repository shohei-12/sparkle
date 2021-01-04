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
end
