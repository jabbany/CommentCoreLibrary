module Display {

  /**
   * Interface for serializable objects
   */
  export interface ISerializable {
    /**
     * Returns the serialized form of the current object
     * @return {object} serialized form of object. Must only contain JSON types
     */
    serialize():Object;
  }
}
