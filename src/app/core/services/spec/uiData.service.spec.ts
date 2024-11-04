import { TestBed } from '@angular/core/testing';
import { UiDataService } from '../uiData.service';
import { UtilsService } from '../utils.service';

describe('uiData.service', () => {
  let uiDataService: UiDataService;
  let utilsService: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UiDataService, UtilsService],
    });

      uiDataService = TestBed.inject(UiDataService);
      utilsService = TestBed.inject(UtilsService);
  });

  it('created uiDataService', () => {
    expect(uiDataService).toBeTruthy();
  });

  describe('addColor', () => {
    it('should add color ', () => {
      const color = 'purple';
      uiDataService.addColor(color);

      expect(uiDataService.colorList.some((item) => item.title === color)).toBe(
        true
      );
    });

    it('should remove Color', () => {
      uiDataService.colorList = [{ title: 'purple' }];
      const color = uiDataService.colorList[0].title;
      uiDataService.removeColor(color);

      expect(uiDataService.colorList).toEqual([]);
    });
  });
    
      describe('getColorsArray', () => {
        it('spy been called with colorList, title ', () => {
          jest.spyOn(utilsService, 'pluck');
          uiDataService.colorList = [{ title: 'purple' }];
          uiDataService.getColorsArray();

          expect(utilsService.pluck).toHaveBeenCalledWith(
            uiDataService.colorList,
            'title'
          );
        });
      });
});
