import { ApiService } from './api.service';
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TagInterface } from './tag.interface';

describe('ApiService', () => {
  let apiService: ApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    apiService = TestBed.inject(ApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(apiService).toBeTruthy();
  });

  describe('getTags', () => {
    it('should return tags', () => {
      let tags: TagInterface[] | undefined;
      apiService.getTags().subscribe((res) => {
        tags = res;
      });
      const req = httpTestingController.expectOne(`${apiService.apiUrl}/tags`);
      req.flush([{ id: '1', name: 'foo' }]);
      expect(tags).toEqual([{ id: '1', name: 'foo' }]);
      expect(req.request.method).toEqual('GET');
    });
  });
    
    describe('createTag', () => {
        it('should create tag', () => { 
            let tag: TagInterface | undefined;
            apiService.createTag('foo').subscribe((res) => {
                tag = res;
            });
            const req = httpTestingController.expectOne(`${apiService.apiUrl}/tags`);
            req.flush({ id: '1', name: 'foo' });
            expect(tag).toEqual({ id: '1', name: 'foo' });
          
        })

        it('passes the correct body ', () => {
            let tag: TagInterface | undefined;
            apiService.createTag('foo').subscribe((res) => {
              tag = res;
            });
            const req = httpTestingController.expectOne(
              `${apiService.apiUrl}/tags`
            );
            req.flush({ id: '1', name: 'foo' });
              expect(req.request.method).toEqual('POST');
            expect(req.request.body).toEqual({ name: 'foo' });
        });
    })
});
