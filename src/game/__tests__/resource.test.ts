import * as Resource from '../resource'


describe("resources", () => {
    type Resource = 'metal' | 'wire'
    let resources = Resource.createResources<Resource>()

    beforeEach(() => {
        resources = Resource.createResources()
    })

    describe('creation', () => {
        test('should start with no metal', () => {
            expect(Resource.getResource(resources, 'metal')).toEqual(0)
        })

        test('should start with no resources', () => {
            expect(Resource.getResource(resources, 'metal')).toEqual(0)
            expect(Resource.getResource(resources, 'wire')).toEqual(0)
        })
    })

    describe('setting resource', () => {
        test('should set resource to 0', () => {
            const result = Resource.setResource(resources, 'wire', 0)
            expect(Resource.getResource(result, 'wire')).toEqual(0)
        })

        test('should set resource to 1', () => {
            const result = Resource.setResource(resources, 'wire', 1)
            expect(Resource.getResource(result, 'wire')).toEqual(1)
        })

        test('should set resource to any number', () => {
            const result = Resource.setResource(resources, 'wire', 10)
            expect(Resource.getResource(result, 'wire')).toEqual(10)
        })
    })

})
