/* eslint-disable @typescript-eslint/ban-types */
type Mock = unknown
type ConstructorMock = () => Mock
/* eslint-enable @typescript-eslint/ban-types */

// store mocks in a Map
const mocks = new Map<string, Mock>()

const mockModule = (
  moduleName: string,
  initialMock?: Mock,
  customize?: (mock: Mock) => Mock
): Mock => {
  // set initial mock
  if (!mocks.has(moduleName)) {
    mocks.set(moduleName, initialMock || {})
  }
  // allow using callback to customize the mock
  if (customize) {
    mocks.set(moduleName, customize(mocks.get(moduleName)))
  }

  // return the mock
  return mocks.get(moduleName)
}

const AWSMock: {
  [serviceName: string]: ConstructorMock
} = jest.genMockFromModule('aws-sdk')
export const mockAWSService = (
  serviceName: string,
  customize?: (mock: ConstructorMock) => ConstructorMock
) => {
  return mockModule(
    'aws-sdk',
    {
      [serviceName]: AWSMock[serviceName]
    },
    (awsMock: typeof AWSMock) => {
      if (customize) {
        awsMock[serviceName] = customize(awsMock[serviceName])
      }

      return awsMock
    }
  ) as typeof AWSMock
}

export const mockAWSClient = (
  serviceName: string,
  customize?: (mock: ConstructorMock) => ConstructorMock
) => {
  mockAWSService(serviceName, customize)

  const awsMock = mocks.get('aws-sdk') as typeof AWSMock

  return awsMock[serviceName]()
}
