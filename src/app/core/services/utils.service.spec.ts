import { TestBed } from "@angular/core/testing";
import { UtilsService } from "./utils.service";

describe('UtilsService', () => {
    let utilsService: UtilsService;

    beforeEach(() => {
       TestBed.configureTestingModule({
           providers: [UtilsService]
       }).compileComponents();
        
       utilsService = TestBed.inject(UtilsService);
    })

    it('should be created', () => {
        expect(utilsService).toBeTruthy();
    })

    describe('range', () => {
        it('returns correct result for 1-6 range', () => {
            expect(utilsService.range(1, 5)).toEqual([1, 2, 3, 4,5]);
        })

        it('returns correct result for 5-9 range', () => {
          expect(utilsService.range(5, 9)).toEqual([5, 6, 7, 8,9]);
        });
    })

})