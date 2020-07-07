import * as Resource from '../resource'


describe("resources", () => {
    let resources = Resource.createResources()
    const RESOURCE_TYPE = Resource.ResourceType.metal

    beforeEach(() => {
        resources = Resource.createResources()
    })

    describe('creation', () => {

        test('should start with no metal', () => {
            expect(Resource.getResource(resources, RESOURCE_TYPE)).toEqual(0)
        })

        test('should start with no resources', () => {
            Object.values(Resource.ResourceType).forEach(resource => {
                expect(Resource.getResource(resources, resource)).toEqual(0)
            })
        })
    })

    describe('setting resource', () => {
        test('should set resource to 0', () => {
            const result = Resource.setResource(resources, RESOURCE_TYPE, 0)
            expect(Resource.getResource(result, RESOURCE_TYPE)).toEqual(0)
        })

        test('should set resource to 1', () => {
            const result = Resource.setResource(resources, RESOURCE_TYPE, 1)
            expect(Resource.getResource(result, RESOURCE_TYPE)).toEqual(1)
        })

        test('should set resource to any number', () => {
            const result = Resource.setResource(resources, RESOURCE_TYPE, 10)
            expect(Resource.getResource(result, RESOURCE_TYPE)).toEqual(10)
        })
    })

})


test("placeholder", () => { })
