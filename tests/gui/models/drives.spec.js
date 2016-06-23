'use strict';

const m = require('mochainon');
const angular = require('angular');
require('angular-mocks');

describe('Browser: DrivesModel', function() {

  beforeEach(angular.mock.module(
    require('../../../lib/gui/models/drives'),
    require('../../../lib/gui/models/selection-state')
  ));

  describe('DrivesModel', function() {

    let DrivesModel;
    let SelectionStateModel;

    beforeEach(angular.mock.inject(function(_DrivesModel_, _SelectionStateModel_) {
      DrivesModel = _DrivesModel_;
      SelectionStateModel = _SelectionStateModel_;
    }));

    it('should have no drives by default', function() {
      m.chai.expect(DrivesModel.getDrives()).to.deep.equal([]);
    });

    describe('.setDrives()', function() {

      it('should throw if no drives', function() {
        m.chai.expect(function() {
          DrivesModel.setDrives();
        }).to.throw('Missing drives');
      });

      it('should throw if drives is not an array', function() {
        m.chai.expect(function() {
          DrivesModel.setDrives(123);
        }).to.throw('Invalid drives: 123');
      });

      it('should throw if drives is not an array of objects', function() {
        m.chai.expect(function() {
          DrivesModel.setDrives([
            123,
            123,
            123
          ]);
        }).to.throw('Invalid drives: 123,123,123');
      });

    });

    describe('given no drives', function() {

      describe('.hasAvailableDrives()', function() {

        it('should return false', function() {
          m.chai.expect(DrivesModel.hasAvailableDrives()).to.be.false;
        });

      });

      describe('.setDrives()', function() {

        it('should be able to set drives', function() {
          const drives = [
            {
              device: '/dev/sdb',
              description: 'Foo',
              size: '14G',
              mountpoint: '/mnt/foo',
              system: false
            }
          ];

          DrivesModel.setDrives(drives);
          m.chai.expect(DrivesModel.getDrives()).to.deep.equal(drives);
        });

      });

    });

    describe('given drives', function() {

      beforeEach(function() {
        this.drives = [
          {
            device: '/dev/sdb',
            name: 'SD Card',
            size: 9999999,
            mountpoint: '/mnt/foo',
            system: false,
            protected: false
          },
          {
            device: '/dev/sdc',
            name: 'USB Drive',
            size: 9999999,
            mountpoint: '/mnt/bar',
            system: false,
            protected: false
          }
        ];

        DrivesModel.setDrives(this.drives);
      });

      describe('given one of the drives was selected', function() {

        beforeEach(function() {
          SelectionStateModel.setDrive({
            device: '/dev/sdc',
            name: 'USB Drive',
            size: 9999999,
            mountpoint: '/mnt/bar',
            system: false,
            protected: false
          });
        });

        afterEach(function() {
          SelectionStateModel.removeDrive();
        });

        it('should be delected if its not contain in the available drives anymore', function() {
          m.chai.expect(SelectionStateModel.hasDrive()).to.be.true;
          DrivesModel.setDrives([
            {
              device: '/dev/sdb',
              name: 'SD Card',
              size: 9999999,
              mountpoint: '/mnt/foo',
              system: false,
              protected: false
            }
          ]);
          m.chai.expect(SelectionStateModel.hasDrive()).to.be.false;
        });

      });

      describe('.hasAvailableDrives()', function() {

        it('should return true', function() {
          const hasDrives = DrivesModel.hasAvailableDrives();
          m.chai.expect(hasDrives).to.be.true;
        });

      });

      describe('.setDrives()', function() {

        it('should keep the same drives if equal', function() {
          DrivesModel.setDrives(this.drives);
          m.chai.expect(DrivesModel.getDrives()).to.deep.equal(this.drives);
        });

        it('should consider drives with different $$hashKey the same', function() {
          this.drives[0].$$haskey = 1234;
          DrivesModel.setDrives(this.drives);
          m.chai.expect(DrivesModel.getDrives()).to.deep.equal(this.drives);
        });

      });

    });

  });
});