import { createResourceModule } from '../resource'
type Resource = 'metal' | 'wire'
const Resource = createResourceModule<Resource>()


describe( "resources", () => {
    let resources = Resource.createResourceCollection()

    beforeEach( () => {
        resources = Resource.createResourceCollection()
    } )

    describe( 'creation', () => {
        test( 'should start with no metal', () => {
            expect( Resource.getResource( 'metal', resources ) ).toEqual( 0 )
        } )

        test( 'should start with no resources', () => {
            expect( Resource.getResource( 'metal', resources ) ).toEqual( 0 )
            expect( Resource.getResource( 'wire', resources ) ).toEqual( 0 )
        } )
    } )

    describe( 'setting resource', () => {
        test( 'should set resource to 0', () => {
            const result = Resource.setResource( 'wire', 0, resources )
            expect( Resource.getResource( 'wire', result ) ).toEqual( 0 )
        } )

        test( 'should set resource to 1', () => {
            const result = Resource.setResource( 'wire', 1, resources )
            expect( Resource.getResource( 'wire', resources ) ).toEqual( 1 )
        } )

        test( 'should set resource to any number', () => {
            const result = Resource.setResource( 'wire', 10, resources )
            expect( Resource.getResource( 'wire', resources ) ).toEqual( 10 )
        } )
    } )

} )
